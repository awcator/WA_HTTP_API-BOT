# Pull base image
FROM debian:latest
# install dependcies
#RUN apt-get update && apt-get install --no-install-recommends -y nginx; \
# Expose HTTP
# EXPOSE 6969
# Start APIserver
CMD ["/usr/sbin/whatsappbot"]
