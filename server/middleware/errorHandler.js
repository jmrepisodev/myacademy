const errorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(500).json({ error: "Error interno del servidor: "+ err.message });
};

module.exports = errorHandler;
