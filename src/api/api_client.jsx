import instance from "./axios_Instance";


export const LoginUser = async (data) => {
    return await instance.post('/admin/login', data)
}

export const UploadImage = async (formData) => {
    return await instance.post("/admin/images-upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const UpdateImage = async (formData) => {
    return await instance.post(`/admin/images-update`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const GetImages = async (data) => {
    return await instance.get('/admin/all-images', data)
}

export const GetUsers = async (data) => {
    return await instance.get('/admin/get-users', data)
}


export const SyncUser = async (data) => {
    return await instance.post('/admin/sync-user', data)
}


export const SendEmail = async (data) => {
    return await instance.post('/admin/send-email', data)
}

export const EmailTemplate = async (data) => {
    return await instance.get('/admin/email-template', data)
}

export const TestEmail = async (data) => {
    return await instance.post('/admin/test-email', data)
}

export const GetTemplate = async (data) => {
    return await instance.get('/admin/get-template', data)
}

export const SingleTemplate = async (data) => {
    return await instance.get(`/admin/single-template?id=${data.id}`, data)
}


export const UpdateTemplate = async (data) => {
    return await instance.post(`/admin/update-template`, data)
}


export const SingleUpload = async (formData) => {
    return await instance.post("/admin/single-upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}