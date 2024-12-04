
const testApi = async (req, res) => {
    try {
      res.status(201).json({ status: true, code: 200, message: 'Get Api run successfully', result:null });
    } catch (error) {
      res.status(400).json({ status: false, code: 404, message: error.message, result:null });
    }
  };

module.exports = {
    testApi
}
