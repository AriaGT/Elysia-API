FROM debian:buster-slim
RUN apt-get update && apt-get install -y curl && apt-get install -y unzip
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
WORKDIR /app
COPY package.json /app
COPY bun.lockb /app
RUN bun install
RUN bunx prisma generate
COPY . /app
EXPOSE 8080
ENTRYPOINT ["bun", "run", "build"]
