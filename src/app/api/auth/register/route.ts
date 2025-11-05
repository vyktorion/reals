import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth/hash';
import { createUser, getUserByEmail } from '@/services/user.service';
import { UserRole } from '@/entities/user';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Registration API called');

    const { name, email, role, password } = await request.json();

    console.log('📝 Registration data:', {
      name,
      email,
      role,
      passwordLength: password?.length
    });

    // Validate input
    if (!name || !email || !role || !password) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { message: 'Toate câmpurile sunt obligatorii' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json(
        { message: 'Parola trebuie să aibă cel puțin 6 caractere' },
        { status: 400 }
      );
    }

    if (!['Proprietar', 'Agent', 'Agenție', 'Dezvoltator'].includes(role)) {
      console.log('❌ Invalid role:', role);
      return NextResponse.json(
        { message: 'Rol invalid' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('❌ User already exists');
      return NextResponse.json(
        { message: 'Un utilizator cu acest email există deja' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('🔐 Hashing password');
    const hashedPassword = await hashPassword(password);

    // Create user
    console.log('👤 Creating user with data:', { name, email, role });
    const user = await createUser({
      name,
      email,
      role: role as UserRole,
      hashedPassword,
    });

    console.log('✅ User created successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Return success (don't include password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword: _hashedPassword, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'Utilizator creat cu succes', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { message: 'A apărut o eroare la înregistrare' },
      { status: 500 }
    );
  }
}