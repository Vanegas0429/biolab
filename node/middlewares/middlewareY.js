// Middleware Y: Acceso Exclusivo para Administrador (Gestión de Usuarios)
export const checkMiddlewareY = (req, res, next) => {
    try {
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ message: 'No autenticado o token sin rol válido' });
        }

        if (req.user.rol.toLowerCase() !== 'administrador') {
            return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de Administrador' });
        }

        return next();
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Acceso prohibido' });
    }
};
