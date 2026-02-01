/**
 * 用户相关API服务
 *
 * 这个文件封装了与用户相关的所有API调用，包括用户信息获取、更新等
 * 目前使用模拟数据，后续将替换为真实API调用
 */

// 模拟API延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 用户信息类型
export interface UserProfile {
  name: string
  email: string
  role: string
  bio: string
  phone: string
  location: string
  avatar?: string
}

// 用户设置类型
export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    taskUpdates: boolean
    securityAlerts: boolean
    marketingEmails: boolean
  }
  theme: string
}

/**
 * 获取当前用户信息
 *
 * @returns 用户信息
 *
 * TODO: 替换为真实API调用
 * GET /api/user/profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    // 模拟API延迟
    await delay(800)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/user/profile');
    // if (!response.ok) throw new Error('Failed to fetch user profile');
    // return await response.json();

    // 模拟用户数据
    return {
      name: "svcvit",
      email: "admin@example.com",
      role: "管理员",
      bio: "系统管理员，负责平台的整体管理和维护。",
      phone: "13800138000",
      location: "北京",
    }
  } catch (error) {
    console.error("获取用户信息失败:", error)
    throw error
  }
}

/**
 * 更新用户信息
 *
 * @param profile 用户信息
 * @returns 更新后的用户信息
 *
 * TODO: 替换为真实API调用
 * PUT /api/user/profile
 */
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  try {
    // 模拟API延迟
    await delay(1000)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/user/profile', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profile)
    // });
    // if (!response.ok) throw new Error('Failed to update user profile');
    // return await response.json();

    // 模拟更新成功
    return {
      ...(await getUserProfile()),
      ...profile,
    }
  } catch (error) {
    console.error("更新用户信息失败:", error)
    throw error
  }
}

/**
 * 更新用户密码
 *
 * @param currentPassword 当前密码
 * @param newPassword 新密码
 * @returns 操作结果
 *
 * TODO: 替换为真实API调用
 * PUT /api/user/password
 */
export async function updateUserPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    // 模拟API延迟
    await delay(1000)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/user/password', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ currentPassword, newPassword })
    // });
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Failed to update password');
    // }
    // return { success: true };

    // 模拟密码验证
    if (currentPassword !== "password") {
      return {
        success: false,
        message: "当前密码不正确",
      }
    }

    // 模拟更新成功
    return {
      success: true,
      message: "密码已成功更新",
    }
  } catch (error) {
    console.error("更新密码失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "更新密码失败",
    }
  }
}

/**
 * 获取用户设置
 *
 * @returns 用户设置
 *
 * TODO: 替换为真实API调用
 * GET /api/user/settings
 */
export async function getUserSettings(): Promise<UserSettings> {
  try {
    // 模拟API延迟
    await delay(800)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/user/settings');
    // if (!response.ok) throw new Error('Failed to fetch user settings');
    // return await response.json();

    // 模拟用户设置
    return {
      notifications: {
        email: true,
        push: true,
        taskUpdates: true,
        securityAlerts: true,
        marketingEmails: false,
      },
      theme: "light",
    }
  } catch (error) {
    console.error("获取用户设置失败:", error)
    throw error
  }
}

/**
 * 更新用户设置
 *
 * @param settings 用户设置
 * @returns 更新后的用户设置
 *
 * TODO: 替换为真实API调用
 * PUT /api/user/settings
 */
export async function updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  try {
    // 模拟API延迟
    await delay(1000)

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/user/settings', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings)
    // });
    // if (!response.ok) throw new Error('Failed to update user settings');
    // return await response.json();

    // 模拟更新成功
    return {
      ...(await getUserSettings()),
      ...settings,
    }
  } catch (error) {
    console.error("更新用户设置失败:", error)
    throw error
  }
}

/**
 * 上传用户头像
 *
 * @param file 头像文件
 * @returns 上传结果和头像URL
 *
 * TODO: 替换为真实API调用
 * POST /api/user/avatar
 */
export async function uploadUserAvatar(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    // 模拟API延迟
    await delay(1500)

    // TODO: 替换为真实API调用
    // const formData = new FormData();
    // formData.append('avatar', file);
    // const response = await fetch('/api/user/avatar', {
    //   method: 'POST',
    //   body: formData
    // });
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Failed to upload avatar');
    // }
    // const data = await response.json();
    // return { success: true, url: data.url };

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        message: "请上传图片文件",
      }
    }

    // 检查文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
      return {
        success: false,
        message: "文件大小不能超过2MB",
      }
    }

    // 模拟上传成功
    return {
      success: true,
      url: URL.createObjectURL(file),
      message: "头像上传成功",
    }
  } catch (error) {
    console.error("上传头像失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "上传头像失败",
    }
  }
}
