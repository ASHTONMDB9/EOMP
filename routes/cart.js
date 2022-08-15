// ...GET cart from user with specific id...//
router.get('/users/:id/cart', (req,res) => {
    db.getConnection((err,connected)=>{
        if(err)throw err;
        const query = `SELECT id,cart FROM users WHERE id = ?`;
        connected.query(query, req.params.id, (err,results)=>{
            if(err) throw err;
            if(results.length >0){
                if(results[0].cart == null){
                    res.json({
                        status:200,
                        results: `This user's cart is empty`
                    });
                }else{
                    res.json({
                        status:200,
                        results: JSON.parse(results[0].cart)
                    })
                }
            }else{
                res.json({
                    status:400,
                    results: `There is no user with that ID`
                });
            }
        })
        connected.release();
    })
  })
  // POST a new product to the cart of the user with a specific id
  router.post('/users/:id/cart',bodyParser.json(), (req,res)=>{
    db.getConnection((err,connected)=>{
        if(err)throw err;
        const check = `SELECT cart FROM users WHERE id = ?`;
        connected.query(check,req.params.id,(err,results)=>{
            if(err) throw err;
            if(results.length> 0){
                let newCart;
                if(results[0].cart == null){
                    newCart = []
                }else{
                    newCart = JSON.parse(results[0].cart);
                }
                let product = {
                    "id" : newCart.length+1,
                    "title" : req.body.title,
                    "price": req.body.price,
                    "decsriptions" : req.body.decsriptions,
                    "image" : req.body.image,
                    "category" : req.body.category,
                    "create_date" : req.body.create_date,
                    "stock" : req.body.stock,
                }
                newCart.push(product);
                const query = `UPDATE users SET cart = ? WHERE id=?`;
                connected.query(query,[JSON.stringify(newCart),req.params.id], (err,results)=>{
                    if(err)throw err;
                    res.json({
                        status:200,
                        results: "Successfully added item to cart"
                    })
                })
            }else{
                res.json({
                    status:400,
                    result: `There is no user with that id`
                })
            }
        })
        connected.release();
    })
  })
  // DELETE user cart
  router.delete('/users/:id/cart', (req,res)=>{
    db.getConnection((err,connected)=>{
        if(err)throw err;
        const check = `SELECT id,cart FROM users WHERE id = ?`;
        connected.query(check, req.params.id, (err,results)=>{
            if(err) throw err;
            if(results.length >0){
                const query = `UPDATE users SET cart = null WHERE id = ?`;
                connected.query(query, req.params.id,(err,results)=>{
                    if(err) throw err
                    res.json({
                        status:200,
                        results: `Successfully cleared the user's cart`
                    })
                });
            }else{
                res.json({
                    status:400,
                    result: `There is no user with that ID`
                });
            }
        })
        connected.release();
    })
  })
  // GET specific item from user cart
  router.get('/users/:id/cart/:cartId', (req,res)=>{
    db.getConnection((err,connected)=>{
        if(err)throw err;
        const check = `SELECT id,cart FROM users WHERE id = ?`;
        connected.query(check, req.params.id, (err,results)=>{
            if(err) throw err;
            if(results.length > 0){
                if(results[0].cart != null){
                    const result = JSON.parse(results[0].cart).filter((x)=>{
                        return x.id == req.params.cartId;
                    })
                    res.json({
                        status:200,
                        result: result[0]
                    })
                }else{
                    res.json({
                        status:400,
                        result: "This user has an empty cart"
                    })
                }
            }else{
                res.json({
                    status:400,
                    result: "There is no user with that id"
                });
            }
        })
        connected.release();
    })
  })
  // DELETE specific item from user cart
  router.delete('/users/:id/cart/:cartId', (req,res)=>{
    db.getConnection((err,connected)=>{
        if(err)throw err;
        const check = `SELECT id,cart FROM users WHERE id = ?`;
        connected.query(check, req.params.id, (err,results)=>{
            if(err) throw err;
            if(results.length > 0){
                if(results[0].cart != null){
                    const result = JSON.parse(results[0].cart).filter((x)=>{
                        return x.id != req.params.cartId;
                    })
                    result.forEach((e,i) => {
                        e.id = i+1
                    });
                    const query = `UPDATE users SET cart = ? WHERE id = ?`;
                    connected.query(query, [JSON.stringify(result),req.params.id], (err,results)=>{
                        if(err) throw err;
                        res.json({
                            status:200,
                            result: "Successfully deleted item from cart"
                        });
                    })
                }else{
                    res.json({
                        status:400,
                        result: "This user has an empty cart"
                    })
                }
            }else{
                res.json({
                    status:400,
                    result: "There is no user with that id"
                });
            }
        })
        connected.release();
    })
  })