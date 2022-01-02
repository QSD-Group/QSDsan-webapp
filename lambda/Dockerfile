FROM public.ecr.aws/lambda/python:3.8

# AWS ECR image provides envs:
# LAMBDA_TASK_ROOT=/var/task
# LAMBDA_RUNTIME_DIR=/var/runtime

# https://github.com/numba/numba/issues/4032#issuecomment-729932921
ENV NUMBA_CACHE_DIR=/tmp/numba_cache

# Copy function code
COPY ./code/app.py ${LAMBDA_TASK_ROOT}

# Copy other needed files
COPY ./code/ContextualParameters.xlsx ${LAMBDA_TASK_ROOT}

# Install the function's dependencies using file requirements.txt
# from your project folder.

COPY ./code/requirements.txt  .
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ] 
