import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateTask {
  title: string;
  deadline: Date;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTask;

  const task = {
    id: uuid4(),
    user_id,
    title,
    done: false,
    deadline,
  };

  await document
    .put({
      TableName: "users_tasks",
      Item: task,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "OK",
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
