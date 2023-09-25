FROM oven/bun
WORKDIR /app
COPY . .
RUN bun install
RUN bun prisma generate
RUN bun prisma migrate deploy

ARG PORT
EXPOSE ${PORT:-8080}

CMD ["bun", "run", "build"]