// Wrapper minimalista de logging.
// - En dev: pasa al console nativo.
// - En prod: silencia debug/info; warn/error siguen visibles.
// - `report()` es el hook futuro para Sentry/Datadog/etc — hoy solo console.error.

const isDev = import.meta.env?.DEV ?? false;

type LogContext = Record<string, unknown>;

function format(scope: string, msg: unknown, ctx?: LogContext): unknown[] {
  const prefix = `[${scope}]`;
  if (ctx) return [prefix, msg, ctx];
  return [prefix, msg];
}

export const log = {
  debug(scope: string, msg: unknown, ctx?: LogContext) {
    if (isDev) console.debug(...format(scope, msg, ctx));
  },
  info(scope: string, msg: unknown, ctx?: LogContext) {
    if (isDev) console.info(...format(scope, msg, ctx));
  },
  warn(scope: string, msg: unknown, ctx?: LogContext) {
    console.warn(...format(scope, msg, ctx));
  },
  error(scope: string, msg: unknown, ctx?: LogContext) {
    console.error(...format(scope, msg, ctx));
    report(scope, msg, ctx);
  },
};

// Hook futuro: cuando se integre Sentry/Datadog, esta funcion les envia el error.
// Hoy es no-op (errores ya van por console.error arriba).
function report(_scope: string, _msg: unknown, _ctx?: LogContext): void {
  // Sentry.captureException(msg, { tags: { scope }, extra: ctx });
}
