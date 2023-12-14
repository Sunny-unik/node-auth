const responseResolver = async (controller, parameters, res) => {
  const result = await controller(...parameters);
  const error = result.error;
  if (!error) return res.status(200).send(result);
  console.log(error);
  res
    .status(error.customStatusCode || 500)
    .send({ message: error.customMessage || 'Internal Server Error' });
};

export default responseResolver;
