resource "aws_dynamodb_table" "websocket_table" {
  name           = var.websocket_table_name
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "connectionId"

  attribute {
    name = "connectionId"
    type = "S"
  }
}
