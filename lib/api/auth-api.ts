/**
 * 认证相关API服务
 *
 * 这个文件封装了与用户认证相关的所有API调用，包括登录、注册、密码重置等
 * 目前使用模拟数据，后续将替换为真实API调用
 */

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 用户登录
 *
 * @param username 用户名
 * @param password 密码
 * @returns 登录结果和用户信息
 *
 * TODO: 替换为真实API调用
 * POST /api/auth/login
 */
export async function login(
  username: string,
  password: string,
): Promise<{
  success: boolean
  message?: string
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
  token?: string
}> {
  try {
    // 模拟API延迟
    await delay(1000)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password })
    // });
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Login failed');
    // }
    // return await response.json();

    // 模拟登录验证
    if (username === "admin" && password === "password") {
      // 模拟登录成功
      return {
        success: true,
        user: {
          id: "1",
          name: "svcvit",
          email: "admin@example.com",
          role: "admin",
        },
        token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      }
    } else {
      // 模拟登录失败
      return {
        success: false,
        message: "用户名或密码错误",
      }
    }
  } catch (error) {
    console.error("登录失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "登录失败",
    }
  }
}

/**
 * 用户登出
 *
 * @returns 登出结果
 *
 * TODO: 替换为真实API调用
 * POST /api/auth/logout
 */
export async function logout(): Promise<{ success: boolean; message?: string }> {
  try {
    // 模拟API延迟
    await delay(500)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/auth/logout', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // });
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Logout failed');
    // }
    // return { success: true };

    // 清除本地存储的登录状态
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    return {
      success: true,
      message: "退出登录成功",
    }
  } catch (error) {
    console.error("登出失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "登出失败",
    }
  }
}

/**
 * 发送密码重置验证码
 *
 * @param email 用户邮箱
 * @returns 操作结果
 *
 * TODO: 替换为真实API调用
 * POST /api/auth/forgot-password
 */
export async function sendPasswordResetCode(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    // 模拟API延迟
    await delay(1500)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/auth/forgot-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email })
    // });
    // if (!response.ok) throw new Error('Failed to send verification code');
    // return await response.json();

    // 模拟成功响应
    // 生成一个随机的6位数验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // 在实际应用中，验证码会通过邮件发送给用户，并存储在服务器端
    // 为了演示，我们将验证码存储在localStorage中
    localStorage.setItem("resetPasswordEmail", email)
    localStorage.setItem("verificationCode", verificationCode)

    // 为了演示，打印验证码到控制台
    console.log("验证码:", verificationCode)

    return {
      success: true,
      message: "验证码已发送到您的邮箱",
    }
  } catch (error) {
    console.error("发送验证码失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "发送验证码失败",
    }
  }
}

/**
 * 验证密码重置验证码
 *
 * @param email 用户邮箱
 * @param code 验证码
 * @returns 操作结果和验证令牌
 *
 * TODO: 替换为真实API调用
 * POST /api/auth/verify-code
 */
export async function verifyPasswordResetCode(
  email: string,
  code: string,
): Promise<{
  success: boolean
  message?: string
  token?: string
}> {
  try {
    // 模拟API延迟
    await delay(1000)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/auth/verify-code', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, code })
    // });
    // if (!response.ok) throw new Error('Failed to verify code');
    // return await response.json();

    // 模拟验证逻辑
    const storedEmail = localStorage.getItem("resetPasswordEmail")
    const storedCode = localStorage.getItem("verificationCode")

    if (email !== storedEmail) {
      return {
        success: false,
        message: "邮箱地址不匹配",
      }
    }

    if (code !== storedCode) {
      return {
        success: false,
        message: "验证码不正确",
      }
    }

    // 生成一个模拟的验证令牌
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem("resetToken", resetToken)
    localStorage.setItem("codeVerified", "true")

    return {
      success: true,
      message: "验证成功",
      token: resetToken,
    }
  } catch (error) {
    console.error("验证码验证失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "验证码验证失败",
    }
  }
}

/**
 * 重置密码
 *
 * @param token 验证令牌
 * @param newPassword 新密码
 * @returns 操作结果
 *
 * TODO: 替换为真实API调用
 * POST /api/auth/reset-password
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{
  success: boolean
  message?: string
}> {
  try {
    // 模拟API延迟
    await delay(1500)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/auth/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token, newPassword })
    // });
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Failed to reset password');
    // }
    // return await response.json();

    // 模拟验证令牌检查
    const storedToken = localStorage.getItem("resetToken")
    const isVerified = localStorage.getItem("codeVerified") === "true"

    if (!isVerified || token !== storedToken) {
      return {
        success: false,
        message: "无效的验证令牌",
      }
    }

    // 在实际应用中，这里会更新数据库中的用户密码

    // 清除所有相关的存储
    localStorage.removeItem("resetPasswordEmail")
    localStorage.removeItem("verificationCode")
    localStorage.removeItem("codeVerified")
    localStorage.removeItem("resetToken")

    return {
      success: true,
      message: "密码已成功重置",
    }
  } catch (error) {
    console.error("重置密码失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "重置密码失败",
    }
  }
}
