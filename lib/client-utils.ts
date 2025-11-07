export async function fetchUserDataByCookie() {
    const res = await fetch("/api/cookie", { credentials: "include" });
    const data = await res.json();
    if (data.userId) {
        return fetchUserDataById(data.userId);
    }
}

export async function fetchUserDataById(id: string) {
    const res = await fetch(`/api/user/${id}`);
    const data = await res.json();
    return data.user;
}

export async function fetchServicesByUserId(id: string) {
    const res = await fetch(`/api/service/user/${id}`);
    const data = await res.json();
    return data.services;
}

export async function fetchServiceById(id: string) {
    const res = await fetch(`/api/service/${id}`);
    const data = await res.json();
    return data.service;
}

export async function fetchOrdersByUserId(id: string) {
    const res = await fetch(`/api/order/user/${id}`);
    const data = await res.json();
    return data.orders;
}

export async function fetchTasksByUserIds(id: string, partnerId: string) {
    const res = await fetch(`/api/task/users/${id}/${partnerId}`);
    const data = await res.json();
    return data.tasks;
}

export async function fetchTaskById(id: string) {
    const res = await fetch(`/api/task/${id}`);
    const data = await res.json();
    return data.task;
}

export function isoToDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    })
}