import jenkins.model.*
import com.cloudbees.plugins.credentials.CredentialsScope
import com.cloudbees.jenkins.plugins.awscredentials.*
def addAWS = { accesskey, secretkey ->

        def credentials_store = Jenkins.instance.getExtensionList(
            'com.cloudbees.plugins.credentials.SystemCredentialsProvider'
            )[0].getStore()

        def scope = CredentialsScope.GLOBAL

        def description = ""

        def result = credentials_store.addCredentials(
            com.cloudbees.plugins.credentials.domains.Domain.global(), 
            new AWSCredentialsImpl(scope, 'aws', accesskey, secretkey, description, null, null)
            )

        if (result) {
            println "credential added for ${accesskey}" 
        } else {
            println "failed to add credential for ${accesskey}"
        }

}

