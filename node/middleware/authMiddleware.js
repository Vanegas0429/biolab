import jwt from "jsonwebtoken";

export default async function authMiddleware(req, res, next) {
    try {
        // Comprobar que viene el encabezado de autorización y el token y después verificar que el token es válido
        const authHeader = req.get('Authorization'); // Existe el encabezado de autorización?
        
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' }); // Si no, se retorna error
        }

        // Espera formato: "Bearer TOKEN"
        // Llega un texto pero siempre tiene la palabra 'Bearer' y después viene el token
        const parts = authHeader.split(' '); // Por eso se convierte este texto en un arreglo
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            // Si no queda un arreglo de 2 elementos o si el primer elemento no es la palabra 'Bearer' se retorna un error
            return res.status(401).json({ message: 'Invalid authorization format' });
        }

        const token = parts[1]; // Se obtiene el token que quedó guardado en la posición 1 del arreglo

        if (!token) {
            // Si no existe el token entonces se retorna un error
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verificar y decodificar token con jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded; // Guardar la información del usuario dentro de la petición
        
        return next(); // Si todo está bien sigue el proceso

    } catch (err) {
        // Si hay algún error se captura y se retorna
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}