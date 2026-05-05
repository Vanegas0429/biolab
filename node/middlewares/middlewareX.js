// Middleware X: Acceso para Pasante, Gestor, Instructor y Administrador (Excluye Solicitante)
export const checkMiddlewareX = (req, res, next) => {
    try {
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ message: 'No autenticado o token sin rol válido' });
        }

        const allowedRoles = ['pasante', 'gestor', 'instructor', 'administrador'];
        
        if (!allowedRoles.includes(req.user.rol.toLowerCase())) {
            return res.status(403).json({ message: 'Este rol no permite acceso a este módulo' });
        }

        return next();
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Acceso prohibido' });
    }
};
