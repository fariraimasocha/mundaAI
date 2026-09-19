declare module "cloudflare:node" {
  interface HttpServerHandler {
    fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> | Response;
  }

  interface HttpServerHandlerOptions {
    port: number;
  }

  export function httpServerHandler(options: HttpServerHandlerOptions): HttpServerHandler;
}
