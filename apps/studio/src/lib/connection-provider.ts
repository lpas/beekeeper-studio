import { IGroupedUserSettings } from '@/common/appdb/models/user_setting'
import { IConnection } from '@/common/interfaces/IConnection'
import { IDbConnectionServerConfig } from './db/client'
import { createServer } from './db/index'
import { IDbConnectionPublicServer } from './db/server'

export default {

  convertConfig(config: IConnection, osUsername: string, settings: IGroupedUserSettings): IDbConnectionServerConfig {
    const sqliteExtension = settings?.sqliteExtensionFile?.stringValue || undefined
    const ssh = config.sshEnabled ? {
      host: config.sshHost ? config.sshHost.trim() : null,
      port: config.sshPort,
      user: config.sshUsername ? config.sshUsername.trim() : null,
      password: config.sshPassword,
      privateKey: config.sshKeyfile,
      passphrase: config.sshKeyfilePassword,
      bastionHost: config.sshBastionHost,
      useAgent: config.sshMode == 'agent',
      keepaliveInterval: config.sshKeepaliveInterval,
    } : null

    return {
      client: config.connectionType,
      host: config.host ? config.host.trim() : null,
      port: config.port,
      serviceName: config.serviceName || null,
      domain: config.domain || null,
      socketPath: config.socketPath,
      socketPathEnabled: config.socketPathEnabled,
      user: config.username ? config.username.trim() : null,
      osUser: osUsername,
      password: config.password,
      ssh: ssh,
      ssl: config.ssl,
      sslCaFile: config.sslCaFile,
      sslCertFile: config.sslCertFile,
      sslKeyFile: config.sslKeyFile,
      sslRejectUnauthorized: config.sslRejectUnauthorized,
      trustServerCertificate: config.trustServerCertificate,
      instantClientLocation: settings?.oracleInstantClient?.stringValue || undefined,
      oracleConfigLocation: settings?.oracleConfigLocation?.stringValue || undefined,
      options: config.options,
      redshiftOptions: config.redshiftOptions,
      readOnlyMode: config.readOnlyMode,
      cassandraOptions: config.cassandraOptions,
      bigQueryOptions: config.bigQueryOptions,
      runtimeExtensions: sqliteExtension ? [sqliteExtension] : []
    }
  },

  for(config: IConnection, osUsername: string, settings: IGroupedUserSettings): IDbConnectionPublicServer {
    const convertedConfig = this.convertConfig(config, osUsername, settings)
    const server = createServer(convertedConfig)
    return server
  }
}
