const {
  verifyExistsClients,
  createClientOnDatabase,
  updateClientOnDatabase,
  searchOneClientByIdOnDatabase,
  searchOneClientByEmailonDatabase,
  searchAllClientsOnDatabase,
} = require('./clients-service');

const createClient = async (req, res) => {
  try {
    const client = req.body;
    const { email, cpf } = client;

    const verifyEmailExists = await verifyExistsClients({ email });
    const verifyCpfExists = await verifyExistsClients({ cpf });

    if(verifyEmailExists) {
      return res.status(400).json({
        message: 'This email already exists',
      });
    }

    if(verifyCpfExists) {
      return res.status(400).json({
        message: 'This cpf already exists',
      });
    }

    createClientOnDatabase(client);

    return res.status(201).json({
      message: 'Client registered',
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const searchOneClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await searchOneClientByIdOnDatabase(id);
    return res.status(200).json(client);
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

const searchOneClientByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const client = await searchOneClientByEmailonDatabase(email);
    return res.status(200).json(client);
  } catch (error) {
    return res.status(404).json(error);
  }
};

const searchAllClients = async (req, res) => {
  try {
    const clients = await searchAllClientsOnDatabase();
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(404).json(error);
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = req.body;

    const { email, cpf } = client;

    const verifyIdExists = await verifyExistsClients({ _id: id });
    const verifyEmailExists = await verifyExistsClients({ email });
    const verifyCpfExists = await verifyExistsClients({ cpf });

    if(verifyEmailExists) {
      return res.status(400).json({
        message: 'This email already exists',
      });
    }

    if(verifyCpfExists) {
      return res.status(400).json({
        message: 'This cpf already exists',
      });
    }

    if(verifyIdExists) {
      const clientUpdated = await updateClientOnDatabase(id, client);
      return res.status(200).json({
        message: 'Client updated',
        client: clientUpdated,
      });
    }
    return res.status(404).json({
      message: 'Please, return a valid id',
    });
  } catch (error) {
    return res.status(404).json(error);
  }
};

module.exports = {
  createClient,
  updateClient,
  searchOneClienteById,
  searchOneClientByEmail,
  searchAllClients,
};
