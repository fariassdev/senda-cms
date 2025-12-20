# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app
RUN chown bun:bun /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install --chown=bun:bun /temp/dev/node_modules node_modules
COPY --chown=bun:bun . .

# Create .next directory with correct permissions before switching user
# This ensures the volume mount inherits proper ownership
RUN mkdir -p .next && chown bun:bun .next

USER bun
# run the app
ENTRYPOINT [ "bun", "dev" ]