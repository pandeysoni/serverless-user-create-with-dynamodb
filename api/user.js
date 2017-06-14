'use stricts';
const uuid = require('uuid');
const AWS = require('aws-sdk'); 
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {

  const data = JSON.parse(event.body);
  const timestamp = new Date().getTime();

  if (typeof data.fullname !== 'string' || typeof data.email !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit user because of validation errors.'));
    return;
  }
  const candidateInfo = {
  	id: uuid.v1(),
    fullname: data.fullname,
    email: data.email,
    submittedAt: timestamp,
    updatedAt: timestamp
  }
   const params = {
    TableName: process.env.USER_TABLE,
    Item: candidateInfo
  }
  docClient.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the user item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
}

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.USER_TABLE,
  };
  // fetch all todos from the database
  docClient.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the todos.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
