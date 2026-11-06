set -e
cd /work
apt-get update -qq && apt-get install -y -qq libglpk40 > /dev/null
Rscript -e 'install.packages(c("sna", "igraph", "blockmodeling", "FactoMineR"))'
Rscript -e 'install.packages("pkg/xUCINET_0.0.2.0020.tar.gz", repos = NULL, type = "source")'
Rscript -e 'library(xUCINET); print(packageVersion("xUCINET")); print(xDensity(Padgett_FlorentineFamilies$Marriage))'
mkdir -p proj && cd proj && mkdir -p scripts && cp ../asnr_export.R scripts/ && Rscript scripts/asnr_export.R
cd /work
apt-get update -qq && apt-get install -y -qq libglpk40 > /dev/null
Rscript -e 'install.packages(c("statnet", "RSiena"))'
Rscript -e 'library(ergm); library(RSiena); cat("ergm", format(packageVersion("ergm")), "RSiena", format(packageVersion("RSiena")), "\n")'
chown -R 1000:1000 /work
