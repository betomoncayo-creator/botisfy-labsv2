import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    // 1. Iniciamos Supabase con la Llave Maestra para saltar bloqueos
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // <-- Aquí usa tu llave secreta
    );

    // 2. Inyectar usuario en la BÓVEDA SEGURA (auth.users)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Se auto-confirma para que entre directo
      });

    if (authError) throw authError;

    // 3. Inyectar usuario en el DIRECTORIO VISUAL (public.profiles)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          full_name: fullName,
          role: role,
          email: email,
        },
      ]);

    if (profileError) {
      // Si falla al guardar el perfil, borramos al usuario de la bóveda para no dejar "fantasmas"
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario creado y enlazado.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
