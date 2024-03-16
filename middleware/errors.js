
const middleware = (error, req, res, next) => {
    if (error.name) {
    res.status(400).json({ 
        status: 'error', 
        name: error.name,
        message: error.message,
        path: error.path,
 });
}else{
    res.status(500).json({ 
        status: 'error', 
        name: 'UnkwnownError', 
        message: 'Unkwnown Error',
});
}
};

module.exports = middleware;