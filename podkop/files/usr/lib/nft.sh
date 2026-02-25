# Create an nftables table in the inet family
nft_create_table() {
    local name="$1"

    nft add table inet "$name"
}

# Create a set within a table for storing IPv4 addresses
nft_create_ipv4_set() {
    local table="$1"
    local name="$2"

    nft add set inet "$table" "$name" '{ type ipv4_addr; flags interval; auto-merge; }'
}

nft_create_ifname_set() {
    local table="$1"
    local name="$2"

    nft add set inet "$table" "$name" '{ type ifname; flags interval; }'
}

# Generates a static nftables ruleset file for fw4 inclusion
nft_generate_static_ruleset() {
    local table_name="$1"
    local interface_set="$2"
    local common_set="$3"
    local localv4_set="$4"
    local fakeip_mark="$5"
    local outbound_mark="$6"
    local fakeip_range="$7"
    local tproxy_port="$8"
    local exclude_ntp="$9"

    cat <<EOF
table inet $table_name {
    set $localv4_set {
        type ipv4_addr
        flags interval
        auto-merge
        elements = { 0.0.0.0/8, 10.0.0.0/8, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.0.0.0/24, 192.0.2.0/24, 192.88.99.0/24, 192.168.0.0/16, 198.51.100.0/24, 203.0.113.0/24, 224.0.0.0/4, 240.0.0.0-255.255.255.255 }
    }

    set $common_set {
        type ipv4_addr
        flags interval
        auto-merge
    }

    set $interface_set {
        type ifname
        flags interval
    }

    chain mangle {
        type filter hook prerouting priority -150; policy accept;
        $( [ "$exclude_ntp" = "1" ] && echo "udp dport 123 return" )
        iifname @$interface_set ip daddr @$common_set meta l4proto { tcp, udp } meta mark set $fakeip_mark counter
        iifname @$interface_set ip daddr $fakeip_range meta l4proto { tcp, udp } meta mark set $fakeip_mark counter
    }

    chain mangle_output {
        type route hook output priority -150; policy accept;
        ip daddr @$localv4_set return
        meta mark $outbound_mark counter return
        ip daddr @$common_set meta l4proto { tcp, udp } meta mark set $fakeip_mark counter
        ip daddr $fakeip_range meta l4proto { tcp, udp } meta mark set $fakeip_mark counter
    }

    chain proxy {
        type filter hook prerouting priority -100; policy accept;
        meta mark & $fakeip_mark == $fakeip_mark meta l4proto { tcp, udp } tproxy ip to 127.0.0.1:$tproxy_port counter
    }
}
EOF
}

# Add one or more elements to a set
nft_add_set_elements() {
    local table="$1"
    local set="$2"
    local elements="$3"

    nft add element inet "$table" "$set" "{ $elements }"
}

nft_add_set_elements_from_file_chunked() {
    local filepath="$1"
    local nft_table_name="$2"
    local nft_set_name="$3"
    local chunk_size="${4:-5000}"

    local array count
    count=0
    while IFS= read -r line; do
        line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        [ -z "$line" ] && continue

        if ! is_ipv4 "$line" && ! is_ipv4_cidr "$line"; then
            log "'$line' is not IPv4 or IPv4 CIDR" "debug"
            continue
        fi

        if [ -z "$array" ]; then
            array="$line"
        else
            array="$array,$line"
        fi

        count=$((count + 1))

        if [ "$count" = "$chunk_size" ]; then
            log "Adding $count elements to nft set $nft_set_name" "debug"
            nft_add_set_elements "$nft_table_name" "$nft_set_name" "$array"
            array=""
            count=0
        fi
    done < "$filepath"

    if [ -n "$array" ]; then
        log "Adding $count elements to nft set $nft_set_name" "debug"
        nft_add_set_elements "$nft_table_name" "$nft_set_name" "$array"
    fi
}