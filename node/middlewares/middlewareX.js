// Middleware X: Acceso para Pasante, Gestor, Instructor y Administrador (Excluye Solicitante)
export const checkMiddlewareX = (req, res, next) => {
    try {
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ message: 'No autenticado o token sin rol válido' });
        }

        const allowedRoles = ['pasante', 'gestor', 'instructor', 'administrador'];
        const userRol = req.user.rol.toLowerCase();
        const isSolicitante = userRol === 'solicitante';
        const isGetRequest = req.method === 'GET';
        
        // El endpoint /recursos es una consulta (POST) que el solicitante necesita para ver qué insumos pedir
        const isRecursosQuery = req.method === 'POST' && req.path.includes('/recursos');

        if (!allowedRoles.includes(userRol)) {
            // Permitir GET a solicitantes para catálogos, y POST a /recursos para ver insumos
            if (isSolicitante && (isGetRequest || isRecursosQuery)) {
                return next();
            }
            return res.status(403).json({ message: 'Este rol no permite acceso a este módulo' });
        }

        return next();
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Acceso prohibido' });
    }
};
