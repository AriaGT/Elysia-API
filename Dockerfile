FROM debian:buster-slim
RUN apt-get update && apt-get install -y curl && apt-get install -y unzip
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install
COPY . .
RUN bunx prisma migrate deploy
EXPOSE 8080
ENTRYPOINT ["bun", "run", "build"]
