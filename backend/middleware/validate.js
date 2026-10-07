export const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);
    req.body = parsedData;
    next();
  } catch (err) {
    if (err.name === 'ZodError') {
      const errors = (err.issues || err.errors || []).map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
    next(err);
  }
};

export default validate;
