export const hasRole = (role: string, userRoles: string[] = []) =>
    userRoles.includes(role);


export const hasPermission = (permissions: string[], userPermissions: string) =>
    permissions.includes(userPermissions);

