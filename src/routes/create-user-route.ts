import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createUsersRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/users",
		{
			schema: {
				summary: "Create an user",
				security: [{ bearerAuth: [] }],
				body: z.object({
					name: z.string().max(100).nullable(),
					email: z.email(),
				}),
				response: {
					201: z
						.object({
							userId: z.uuid().describe("New user ID"),
						})
						.describe("User Created"),

					400: z
						.object({
							errors: z.array(
								z.object({
									name: z.string(),
									error: z.string(),
								}),
							),
						})
						.describe("Validation failed"),

					409: z.object().describe("User e-mail already exists"),
				},
			},
		},
		(request) => {
			return { userId: "123" };
		},
	);
};
