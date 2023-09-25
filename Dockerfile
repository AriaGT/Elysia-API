FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y curl && apt-get install -y unzip
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
WORKDIR /app
COPY package.json /app
COPY bun.lockb /app
RUN bun install
COPY . /app
CMD ["bunx", "prisma", "generate"]
CMD ["bunx", "prisma", "migrate", "deploy"]
EXPOSE 8080
ENTRYPOINT ["bun", "run", "build"]
