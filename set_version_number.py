"""Set version number."""

import argparse
import re

parser = argparse.ArgumentParser(description="Set version number")
parser.add_argument('version', metavar='version', nargs=1,
                    default=None, help="Vertion number.")

args = parser.parse_args()
version = args.version[0]


if not re.match(r"^[0-9]+\.[0-9]+\.[0-9]+$", version):
    raise ValueError(f"{version} has incorrect format")

# VERSION
with open("VERSION", "w") as f:
    f.write(version)

# crosspuzzle.css
with open("crosspuzzle.css") as f:
    content = f.read()
pre, post = content.split("Crosspuzzle v", 1)
post = post.split(" ", 1)[1]
content = f"{pre}Crosspuzzle v{version} {post}"
with open("crosspuzzle.css", "w") as f:
    f.write(content)

# crosspuzzle.js
with open("crosspuzzle.js") as f:
    content = f.read()
pre, post = content.split("Crosspuzzle v", 1)
post = post.split(" ", 1)[1]
content = f"{pre}Crosspuzzle v{version} {post}"
with open("crosspuzzle.js", "w") as f:
    f.write(content)

# examples.html
with open("examples.html") as f:
    content = f.read()
pre, post = content.split("Crosspuzzle v", 1)
post = post.split(" ", 1)[1]
content = f"{pre}Crosspuzzle v{version} {post}"
parts = content.split("?v=")
content = parts[0]
for p in parts[1:]:
    p = p.split("'", 1)[1]
    content += f"?v={version}'{p}"
parts = content.split("https://mscroggs.github.io/crosspuzzle/v")
content = parts[0]
for p in parts[1:]:
    p = p.split("/", 1)[1]
    content += f"https://mscroggs.github.io/crosspuzzle/v{version}/{p}"
with open("examples.html", "w") as f:
    f.write(content)

# README.md
with open("README.md") as f:
    content = f.read()
parts = content.split("https://mscroggs.github.io/crosspuzzle/v")
content = parts[0]
for p in parts[1:]:
    p = p.split("/", 1)[1]
    content += f"https://mscroggs.github.io/crosspuzzle/v{version}/{p}"
with open("README.md", "w") as f:
    f.write(content)

