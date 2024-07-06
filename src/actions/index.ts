import { defineAction, z } from "astro:actions";
import { mutateData } from "../utils/mutate-date";

interface Payload {
  data: {
    email: string;
  };
}

export const server = {
  email: defineAction({
    accept: "form",
    input: z.object({
      email: z
        .string({ message: "This field has to be filled." })
        .email("This is not a valid email."),
    }),

    handler: async (formData) => {
      // insert comments in db
      console.log(formData);

      const payload = {
        data: {
          email: formData.email,
        },
      };

      const responseData = await mutateData("POST", "/api/signups", payload);

      console.log(responseData)

      if (!responseData) {
        return {
          strapiErrors: null,
          message: "Ops! Something went wrong. Please try again.",
        };
      }

      if (responseData.error) {
        return {
          strapiErrors: responseData.error,
          message: "Failed to Register.",
        };
      }

      return {
        message: "Form submitted, thank you.",
        data: responseData,
        strapiErrors: null,
      };
    },
  }),
};
