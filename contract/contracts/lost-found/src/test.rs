#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address, Env, String};

#[test]
fn test_create_report() {
    let env = Env::default();
    let contract_id = env.register(LostFoundContract, ());
    let client = LostFoundContractClient::new(&env, &contract_id);

    env.mock_all_auths();

    let owner = <soroban_sdk::Address as Address>::generate(&env);
    let item_name = String::from_str(&env, "Black Wallet");
    let location = String::from_str(&env, "Library");
    let description = String::from_str(&env, "Leather wallet with student ID");

    let report_id = client.create_report(&owner, &item_name, &location, &description);

    let report = client.get_report(&report_id);
    assert_eq!(report.id, report_id);
    assert_eq!(report.owner, owner);
    assert_eq!(report.item_name, item_name);
    assert_eq!(report.location, location);
    assert_eq!(report.description, description);
    assert_eq!(report.status, 0);
}

#[test]
fn test_mark_found() {
    let env = Env::default();
    let contract_id = env.register(LostFoundContract, ());
    let client = LostFoundContractClient::new(&env, &contract_id);

    env.mock_all_auths();

    let owner = <soroban_sdk::Address as Address>::generate(&env);
    let finder = <soroban_sdk::Address as Address>::generate(&env);
    let item_name = String::from_str(&env, "Black Wallet");
    let location = String::from_str(&env, "Library");
    let description = String::from_str(&env, "Leather wallet with student ID");

    let report_id = client.create_report(&owner, &item_name, &location, &description);

    client.mark_found(&finder, &report_id);

    let report = client.get_report(&report_id);
    assert_eq!(report.status, 1);
    assert_eq!(report.finder, finder);
}

#[test]
fn test_confirm_recovery() {
    let env = Env::default();
    let contract_id = env.register(LostFoundContract, ());
    let client = LostFoundContractClient::new(&env, &contract_id);

    env.mock_all_auths();

    let owner = <soroban_sdk::Address as Address>::generate(&env);
    let finder = <soroban_sdk::Address as Address>::generate(&env);
    let item_name = String::from_str(&env, "Black Wallet");
    let location = String::from_str(&env, "Library");
    let description = String::from_str(&env, "Leather wallet with student ID");

    let report_id = client.create_report(&owner, &item_name, &location, &description);
    client.mark_found(&finder, &report_id);
    client.confirm_recovery(&owner, &report_id);

    let report = client.get_report(&report_id);
    assert_eq!(report.status, 2);
}
