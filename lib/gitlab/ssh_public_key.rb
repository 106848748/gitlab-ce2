require 'net/ssh'

module Gitlab
  class SSHPublicKey
    include Gitlab::Popen

    TYPES = %w[rsa dsa ecdsa].freeze

    Technology = Struct.new(:name, :allowed_sizes)

    Technologies = [
      Technology.new('rsa',   [1024, 2048, 3072, 4096]),
      Technology.new('dsa',   [1024, 2048, 3072]),
      Technology.new('ecdsa', [256, 384, 521])
    ].freeze

    def self.technology_names
      Technologies.map(&:name)
    end

    def self.technology(name)
      Technologies.find { |ssh_key_technology| ssh_key_technology.name == name }
    end
    private_class_method :technology

    def self.allowed_sizes(name)
      technology(name).allowed_sizes
    end

    def self.allowed_type?(type)
      technology_names.include?(type.to_s)
    end

    def initialize(key_text)
      @key_text = key_text
    end

    def valid?
      type.present?
    end

    def type
      return @type if defined?(@type)

      @type =
        case key
        when OpenSSL::PKey::EC
          :ecdsa
        when OpenSSL::PKey::RSA
          :rsa
        when OpenSSL::PKey::DSA
          :dsa
        end
    end

    def size
      return @size if defined?(@size)

      @size =
        case type
        when :ecdsa
          key.public_key.to_bn.num_bits / 2
        when :rsa
          key.n.num_bits
        when :dsa
          key.p.num_bits
        end
    end

    def fingerprint
      cmd_status = 0
      cmd_output = ''

      Tempfile.open('gitlab_key_file') do |file|
        file.puts key_text
        file.rewind

        cmd = []
        cmd.push('ssh-keygen')
        cmd.push('-E', 'md5') if explicit_fingerprint_algorithm?
        cmd.push('-lf', file.path)

        cmd_output, cmd_status = popen(cmd, '/tmp')
      end

      return nil unless cmd_status.zero?

      # 16 hex bytes separated by ':', optionally starting with "MD5:"
      fingerprint_matches = cmd_output.match(/(MD5:)?(?<fingerprint>(\h{2}:){15}\h{2})/)
      return nil unless fingerprint_matches

      fingerprint_matches[:fingerprint]
    end

    private

    attr_accessor :key_text

    def key
      return @key if defined?(@key)

      @key = begin
        Net::SSH::KeyFactory.load_data_public_key(key_text)
      rescue StandardError, NotImplementedError
        nil
      end
    end

    def explicit_fingerprint_algorithm?
      # OpenSSH 6.8 introduces a new default output format for fingerprints.
      # Check the version and decide which command to use.

      version_output, version_status = popen(%w[ssh -V])
      return false unless version_status.zero?

      version_matches = version_output.match(/OpenSSH_(?<major>\d+)\.(?<minor>\d+)/)
      return false unless version_matches

      version_info = Gitlab::VersionInfo.new(version_matches[:major].to_i, version_matches[:minor].to_i)

      required_version_info = Gitlab::VersionInfo.new(6, 8)

      version_info >= required_version_info
    end
  end
end
