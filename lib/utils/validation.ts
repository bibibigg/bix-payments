export function validateEmail(email: string): string | null {
  if (!email) return '이메일을 입력해주세요';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '올바른 이메일 형식이 아닙니다';
  return null;
}

export function validateName(name: string): string | null {
  if (!name || name.trim().length < 1) return '이름을 입력해주세요';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return '비밀번호를 입력해주세요';
  if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다';
  if (!/[a-zA-Z]/.test(password)) return '영문자를 1개 이상 포함해야 합니다';
  if (!/[0-9]/.test(password)) return '숫자를 1개 이상 포함해야 합니다';
  if (!/[!%*#?&]/.test(password)) return '특수문자(!%*#?&)를 1개 이상 포함해야 합니다';
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return '비밀번호 확인을 입력해주세요';
  if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다';
  return null;
}

export function validateSignupForm(data: {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.username);
  if (emailError) errors.username = emailError;

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
}
