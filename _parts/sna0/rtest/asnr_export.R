# Az ASNR (xUCINET) összes adatkészletének exportja CSV-be.
# Futtatás a projekt gyökeréből:  Rscript scripts/asnr_export.R
library(xUCINET)

out <- "data/asnr_r"
dir.create(out, recursive = TRUE, showWarnings = FALSE)
names <- data(package = "xUCINET")$results[, "Item"]

for (name in names) {
  obj <- get(name)
  dir <- file.path(out, name)
  dir.create(dir, showWarnings = FALSE)
  if (is.matrix(obj) || is.data.frame(obj)) {          # ábraadatok, Greenacre
    write.csv(obj, file.path(dir, paste0(name, ".csv")))
    next
  }
  for (part in names(obj)) {
    x <- obj[[part]]
    if (part == "ProjectInfo") {
      capture.output(str(x), file = file.path(dir, "ProjectInfo.txt"))
    } else if (is.matrix(x) || is.data.frame(x)) {
      write.csv(x, file.path(dir, paste0(part, ".csv")))
    }
  }
}
cat("Kész:", length(names), "adatkészlet ->", out, "\n")
