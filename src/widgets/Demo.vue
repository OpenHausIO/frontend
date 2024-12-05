<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Demo",
  data() {
    return {};
  },
  menu: [],
});
</script>


<template>
  <div class="container-fluid text-muted">

    <div class="col-12">
      <div class="row p-4">
        <div class="container">

          <h3>
            Welcome to the OpenHaus demo installation.
          </h3>

          <p>
            This installation is full functional and resetted to the default values every 30 Minutes.<br />
            The Webserver can be accessd via HTTP & HTTPS.
          </p>

          <p>
            If no path in the URL is defined, a redirect from HTTP to HTTPS is done.<br />
            For the most cases this can be ignored.
          </p>

          <p>
            If you need direct access to the services, take a look in the table below.<br />
            There you can see how to access the services directly.
          </p>

          <table class="table w-auto text-muted table-bordered">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">HTTP</th>
                <th scope="col">HTTPS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Backend</td>
                <td>8081 (<a href="http://demo.open-haus.io:8081">http://demo.open-haus.io:8081</a>)</td>
                <td>8431 (<a href="https://demo.open-haus.io:8431">https://demo.open-haus.io:8431</a>)</td>
              </tr>
              <tr>
                <td>Fronted</td>
                <td>8082 (<a href="http://demo.open-haus.io:8082">http://demo.open-haus.io:8082</a>)</td>
                <td>8432 (<a href="https://demo.open-haus.io:8432">https://demo.open-haus.io:8432</a>)</td>
              </tr>
              <tr class="hide">
                <td>Connector</td>
                <td>8083 (<a href="http://demo.open-haus.io:8083">http://demo.open-haus.io:8083</a>)</td>
                <td>8433 (<a href="https://demo.open-haus.io:8433">https://demo.open-haus.io:8433</a>)</td>
              </tr>
            </tbody>
          </table>

          <p>
            Documantation can be found on <a href="https://docs.open-haus.io">docs.open-haus.io</a><br />
            Feel free to explorer & experiment with the demo installation.<br />
          </p>

          <p>
             <b>There are <u>no</u> limitations.</b>
          </p>

          <p>
            HTTP API documentation is available as <a
              href="https://github.com/OpenHausIO/backend/blob/dev/postman.json">Postman collection</a>.
          </p>

          <!--
          <p>
            Do you want to take the tour or explore things on your own?
          </p>

          <button class="btn btn-outline-primary">I want a Tour</button>
          -->

        </div>
      </div>
    </div>


  </div>
</template>


<style scoped>
.table-bordered {
  border-color: #6c757d !important;
}
</style>