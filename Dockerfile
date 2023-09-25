FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y curl && apt-get install -y unzip
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
COPY . .
RUN bun install
EXPOSE 9000
ENTRYPOINT ["bun", "run", "build"]
