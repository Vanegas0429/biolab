import userService from ", ,/services/UsuarioService";

export const RegisterUser = async (req, res) => {

    try {

        const user = await userService.register(req.body)
        res.status(201).jsom({ message: "Usuario registrado con exito" })

    } catch (error) {

        res.status(400).json({ message: error.message })


    }
}