import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export class SwaggerConfig {
  private title: string;
  private description: string;
  private version: string;
  private routePrefix: string;

  constructor(
    title: string,
    description: string,
    version: string,
    routePrefix: string
  ) {
    this.title = title;
    this.description = description;
    this.version = version;
    this.routePrefix = routePrefix;
  }

  setup(app: any) {
    app.register(swagger, {
      swagger: {
        info: {
          title: this.title,
          description: this.description,
          version: this.version,
        },
        schemes: ["http"], // Opcional
        consumes: ["application/json"], // Opcional
        produces: ["application/json"], // Opcional
      },
    });

    app.register(swaggerUi, {
      routePrefix: this.routePrefix,
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      staticCSP: true,
      transformSpecificationClone: true,
    });
  }

}
