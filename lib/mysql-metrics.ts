import { prisma } from './db'
import { PrismaClient } from '@prisma/client'

// Use a raw query to get MySQL server metrics
export async function getMysqlMetrics() {
  // These queries use MySQL's SHOW STATUS and SHOW VARIABLES
  const client = prisma as PrismaClient & { $queryRaw: any }
  const [statusRows, variableRows, processRows] = await Promise.all([
    client.$queryRaw`SHOW GLOBAL STATUS`,
    client.$queryRaw`SHOW GLOBAL VARIABLES`,
    client.$queryRaw`SHOW PROCESSLIST`,
  ])

  // Helper to get a value from the status array
  const getStatus = (name: string) => {
    const row = statusRows.find((r: any) => r.Variable_name === name)
    return row ? Number(row.Value) : 0
  }
  const getVariable = (name: string) => {
    const row = variableRows.find((r: any) => r.Variable_name === name)
    return row ? Number(row.Value) : 0
  }

  // Network traffic
  const networkIn = getStatus('Bytes_received')
  const networkOut = getStatus('Bytes_sent')

  // Table cache efficiency
  const openTables = getStatus('Open_tables')
  const openedTables = getStatus('Opened_tables')
  const tableCacheEfficiency = openTables + openedTables > 0 ? Math.round((openTables / (openTables + openedTables)) * 100) : 100

  // InnoDB Buffer Pool
  const innodbBufferPoolUsed = getStatus('Innodb_buffer_pool_pages_data')
  const innodbBufferPoolTotal = getStatus('Innodb_buffer_pool_pages_total')
  const innodbBufferUsage = innodbBufferPoolTotal > 0 ? Math.round((innodbBufferPoolUsed / innodbBufferPoolTotal) * 100) : 0

  // SQL statements per second
  const uptime = getStatus('Uptime')
  const sqlStatements = {
    select: Math.round(getStatus('Com_select') / (uptime || 1)),
    insert: Math.round(getStatus('Com_insert') / (uptime || 1)),
    update: Math.round(getStatus('Com_update') / (uptime || 1)),
    delete: Math.round(getStatus('Com_delete') / (uptime || 1)),
    create: Math.round(getStatus('Com_create') / (uptime || 1)),
    alter: Math.round(getStatus('Com_alter_table') / (uptime || 1)),
    drop: Math.round(getStatus('Com_drop_table') / (uptime || 1)),
  }

  // Connections
  const connectionCount = processRows.length

  return {
    networkIn,
    networkOut,
    tableCacheEfficiency,
    innodbBufferUsage,
    sqlStatements,
    connectionCount,
  }
}
