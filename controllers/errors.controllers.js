
exports.psqlErrorCheck = (err, req, res, next) => {
    //console.log(err)
        if (err.code === '22P02' || err.code === '23502' || err.code === '23503')
            res.status(400).send({msg: "Bad Request"})
        else
            next(err)
}


exports.customErrorCheck = (err, req, res, next) => {
    if(err.status)
        res.status(err.status).send({msg: err.msg})
    else
        res.status(500).send({msg: "Internal Server Error"})
}

