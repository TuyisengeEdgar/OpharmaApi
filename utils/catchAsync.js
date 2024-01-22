module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// version of the first one
/*(fn)=>{
  return (req, res, next)=>{
    fn(req, res, next).catch((err)=>next())
  }
  */
