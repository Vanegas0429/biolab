export default async function rolePlayerMiddleware(req, res, next) {

    try {
        //req.get para tomar datos de header
        //req.user para tomar datos del usuario ya autenticado

        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' })
        }

        if (req.user.rol !== 'solictante', 'instructor', 'pasante', 'gestor', 'administrador') {
            return res.status(403).json({ message: 'Este rol no permite acceso' })
        }

        return next()


    } catch (err) {

        return res.status(403).json({ message: 'Forbidden: Acceso prohibido' });
    }

}