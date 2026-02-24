import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import scalarUI from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { createUsersRoute } from "./routes/create-user-route.ts";
import { getUsersRoute } from "./routes/get-users-route.ts";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Example API Docs",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					schema: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},

	transform: jsonSchemaTransform,
});

app.register(getUsersRoute);
app.register(createUsersRoute);

app.get("/openapi.json", () => app.swagger());

app.register(scalarUI, {
	routePrefix: "/docs",
	configuration: {},
});

app.listen({ port: 3333 }).then(() => {
	console.log("HTTP server running!");
});
