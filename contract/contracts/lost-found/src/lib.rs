#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Env, String, Vec, vec, panic_with_error, Symbol, symbol_short,
};

#[contract]
pub struct LostFoundContract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    ReportNotFound = 1,
    Unauthorized = 2,
    InvalidStatus = 3,
    InvalidInput = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Report {
    pub id: u64,
    pub owner: Address,
    pub item_name: String,
    pub location: String,
    pub description: String,
    pub status: u32,
    pub finder: Address,
    pub created_at: u64,
}

const REPORTS_KEY: Symbol = symbol_short!("REPORTS");

#[contractimpl]
impl LostFoundContract {
    pub fn create_report(
        env: Env,
        owner: Address,
        item_name: String,
        location: String,
        description: String,
    ) -> u64 {
        owner.require_auth();

        if item_name.is_empty() || location.is_empty() || description.is_empty() {
            panic_with_error!(&env, Error::InvalidInput);
        }

        let report_id = env.ledger().sequence() as u64;
        let created_at = env.ledger().timestamp();

        let report = Report {
            id: report_id,
            owner: owner.clone(),
            item_name,
            location,
            description,
            status: 0,
            finder: Address::from_str(&env, "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF"),
            created_at,
        };

        env.storage().persistent().set(&report_id, &report);

        let mut report_ids: Vec<u64> = env.storage().persistent().get(&REPORTS_KEY).unwrap_or_else(|| vec![&env]);
        report_ids.push_back(report_id);
        env.storage().persistent().set(&REPORTS_KEY, &report_ids);

        report_id
    }

    pub fn mark_found(env: Env, caller: Address, report_id: u64) {
        caller.require_auth();

        let mut report: Report = env.storage().persistent().get(&report_id).unwrap_or_else(|| {
            panic_with_error!(&env, Error::ReportNotFound)
        });

        if report.status != 0 {
            panic_with_error!(&env, Error::InvalidStatus);
        }

        report.status = 1;
        report.finder = caller.clone();

        env.storage().persistent().set(&report_id, &report);
    }

    pub fn confirm_recovery(env: Env, owner: Address, report_id: u64) {
        owner.require_auth();

        let mut report: Report = env.storage().persistent().get(&report_id).unwrap_or_else(|| {
            panic_with_error!(&env, Error::ReportNotFound)
        });

        if report.owner != owner {
            panic_with_error!(&env, Error::Unauthorized);
        }

        if report.status != 1 {
            panic_with_error!(&env, Error::InvalidStatus);
        }

        report.status = 2;

        env.storage().persistent().set(&report_id, &report);
    }

    pub fn get_report(env: Env, report_id: u64) -> Report {
        env.storage().persistent().get(&report_id).unwrap_or_else(|| {
            panic_with_error!(&env, Error::ReportNotFound)
        })
    }

    pub fn get_reports(env: Env) -> Vec<Report> {
        let report_ids: Vec<u64> = env.storage().persistent().get(&REPORTS_KEY).unwrap_or_else(|| vec![&env]);
        let mut reports: Vec<Report> = Vec::new(&env);
        let mut i = 0u32;
        while i < report_ids.len() {
            if let Some(report_id) = report_ids.get(i) {
                if let Some(report) = env.storage().persistent().get::<u64, Report>(&report_id) {
                    reports.push_back(report);
                }
            }
            i += 1;
        }
        reports
    }
}

mod test;
