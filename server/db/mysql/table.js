let users =
  `CREATE TABLE IF NOT EXISTS users(
     account VARCHAR(100) NOT NULL UNIQUE COMMENT '账号',
     password VARCHAR(100) NOT NULL COMMENT '密码',
     name VARCHAR(100) NOT NULL COMMENT '用户名',
     state INT NOT NULL DEFAULT 1 COMMENT'状态：0 已激活 1 未激活 2 被禁用',
     country VARCHAR(100) NOT NULL COMMENT '国家',
     city VARCHAR(100) COMMENT '城市',
     address VARCHAR(100) COMMENT '详细地址',
     phone VARCHAR(100) COMMENT '联系号码',
     user_type VARCHAR(100) NOT NULL DEFAULT 'ecoflow_user' COMMENT '用户类型：ecoflow_user',
     timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY ( account )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`

let product =
  `CREATE TABLE IF NOT EXISTS products(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    type INT(5) NOT NULL COMMENT '类型 1：调试工具 2：测试工具 3：生产工具 4：Android APK',
    version varchar(16) NOT NULL COMMENT '版本',
    name varchar(16) NOT NULL COMMENT '名称',
    note varchar(255) DEFAULT NULL COMMENT '简介',
    hash varchar(255) DEFAULT NULL COMMENT '文件hash',
    release_version INT(5) DEFAULT 1 COMMENT '1：release 2：debug',
    path varchar(255) DEFAULT NULL COMMENT '文件保存路径',
    status int DEFAULT '1' COMMENT '状态 0：禁用 1：启用',
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`

let device =
  `CREATE TABLE IF NOT EXISTS devices(
    sn VARCHAR(16) NOT NULL UNIQUE COMMENT 'sn',
    product INT(10) unsigned NOT NULL,
    app_version VARCHAR(16) DEFAULT NULL,
    pd_app VARCHAR(16) DEFAULT NULL NULL,
    inv_app VARCHAR(16) DEFAULT NULL,
    bms_m_app VARCHAR(16) DEFAULT NULL,
    bms_s_app VARCHAR(16) DEFAULT NULL,
    pd_loader VARCHAR(16) DEFAULT NULL,
    inv_loader VARCHAR(16) DEFAULT NULL,
    bms_m_loader VARCHAR(16) DEFAULT NULL,
    bms_s_loader VARCHAR(16) DEFAULT NULL,
    cpuid VARCHAR(48) NOT NULL UNIQUE,
    status VARCHAR(45) DEFAULT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ( sn,cpuid, product )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`

module.exports = [users, product, device]
