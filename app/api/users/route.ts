import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json()

    // 1. Iniciamos Supabase con la Llave Maestra
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2. Inyectar usuario en la BÓVEDA SEGURA (auth.users)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true 
    })

    if (authError) throw authError

    // 3. ANTI-CHOQUES: Esperamos 1 segundo para que tu Trigger termine de crear el perfil en blanco
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. UPSERT BLINDADO: Le decimos que si el 'id' ya existe (por el trigger), solo lo actualice
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
      {
        id: authData.user.id,
        full_name: fullName,
        role: role,
        email: email
      },
      { onConflict: 'id' } // <-- Esta es la regla de oro
    )

    // Si ocurre un error, hacemos Rollback (borramos de la bóveda para no dejar fantasmas)
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    return NextResponse.json({ success: true, message: 'Usuario vinculado exitosamente.' })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}