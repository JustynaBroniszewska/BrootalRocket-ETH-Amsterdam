#!/bin/bash

set -e

ODline=$(grep 'artifacts' hardhat.config.ts)
regex=": \'(.+)\'"
[[ $ODline =~ $regex ]]
outputDir=${BASH_REMATCH[1]}

touch $outputDir/index.ts
> $outputDir/index.ts

for file in $outputDir/*.json
do
    ODline=$(grep 'artifacts' hardhat.config.ts)
    regex='\/([a-zA-Z0-9_]+)\.'
    [[ $file =~ $regex ]]
    name=${BASH_REMATCH[1]}
	  echo "const ${name}Json = require(\"./$name.json\")" >> $outputDir/index.ts
done

echo "export {" >> $outputDir/index.ts

for file in $outputDir/*.json
do
    ODline=$(grep 'artifacts' hardhat.config.ts)
    regex='\/([a-zA-Z0-9_]+)\.'
    [[ $file =~ $regex ]]
    name=${BASH_REMATCH[1]}
	  echo "  ${name}Json," >> $outputDir/index.ts
done

echo "}" >> $outputDir/index.ts

echo "export * from './types'" >> $outputDir/index.ts

if [[ -z "$(git status --porcelain)" ]]; then
    echo "Build canary stored in ${outputDir}/canary.hash"
    git log --pretty=format:'%H' -n 1 > $outputDir/canary.hash
fi
